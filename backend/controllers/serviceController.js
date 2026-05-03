import Service from "../models/Service.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

//helper Function
//it convert array like input into array
//when empty or invalid it return empty array
const parseJsonArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return typeof parsed === "string" ? [parsed] : [];
    } catch {
      return field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};


// it takes date time slot and group them into a yyyy-mm-dd => [time] format 
function normalizeSlotsToMap(slotStrings = []) {
  const map = {};
  slotStrings.forEach((raw) => {
    const m = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) {
      // fallback: keep raw in an "unspecified" bucket
      map["unspecified"] = map["unspecified"] || [];
      map["unspecified"].push(raw);
      return;
    }
    const [, day, monShort, year, hour, minute, ampm] = m;
    const monthIdx = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      .findIndex(x => x.toLowerCase() === monShort.toLowerCase());
    const mm = String(monthIdx + 1).padStart(2, "0");
    const dd = String(Number(day)).padStart(2, "0");
    const dateKey = `${year}-${mm}-${dd}`; // YYYY-MM-DD
    const timeStr = `${String(Number(hour)).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm.toUpperCase()}`;
    map[dateKey] = map[dateKey] || [];
    map[dateKey].push(timeStr);
  });
  return map;
}

//safely convert into number
const sanitizePrice = (v) => Number(String(v ?? "0").replace(/[^\d.-]/g, "")) || 0;
const parseAvailability = (v) => {
  const s = String(v ?? "available").toLowerCase();
  return s === "available" || s === "true";
};

export const createService = async (req, res) => {
  try {
// createService
    const b = req.body || {};
    const instructions = parseJsonArrayField(b.instructions);
    const rawSlots = parseJsonArrayField(b.slots);
    const slots = normalizeSlotsToMap(rawSlots);
    const numericPrice = sanitizePrice(b.price);
    const available = parseAvailability(b.availability);

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }//if files is present it will uploaded in services filder in cloudinary and we will get the url and public id of that image
    
    const service = new Service({
      name: b.name,
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericPrice,
      available: available,
      imageUrl: imageUrl,
      imagePublicId: imagePublicId,
    //   dates: [],
      slots: slots,
      instructions: instructions,
    });

    const saved = await service.save();
    res.status(201).json({ success: true,
         data: saved,
         message: "Service created successfully"
         });
  } catch (err) {
    console.error("createService error:", err);
    return res.status(500).json({ success: false,
         message: "Server error"
         });
  }
};

// to get all the services 
export const getServices = async (req, res) => {
  try {
    const list = await Service
      .find()
      .sort({ createdAt: -1 })
      .lean();   // ✅ yaha aayega

    return res.status(200).json({
      success: true,
      data: list
    });

  } catch (err) {
    console.error("getServices error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//to get service by id
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id).lean();
        if (!service) {
            return res.status(404).json({
                 success: false,
                  message: "Service not found"
                 });
        }

        return res.status(200).json({
            success: true,
            data: service 
        });

    } catch{
        console.error("getServiceById error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  


export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const b = req.body || {};
    const updateData = {};

    // fields update
    if (b.name !== undefined) updateData.name = b.name;
    if (b.about !== undefined) updateData.about = b.about;
    if (b.shortDescription !== undefined) updateData.shortDescription = b.shortDescription;
    if (b.price !== undefined) updateData.price = sanitizePrice(b.price);
    if (b.availability !== undefined) updateData.available = parseAvailability(b.availability);
    if (b.instructions !== undefined) updateData.instructions = parseJsonArrayField(b.instructions);
    if (b.slots !== undefined) updateData.slots = normalizeSlotsToMap(parseJsonArrayField(b.slots));

    // IMAGE UPDATE
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");

        if (up?.secure_url) {
          updateData.imageUrl = up.secure_url;
          updateData.imagePublicId = up.public_id || null;

          // delete old image
          if (existing.imagePublicId) {
            try {
              await deleteFromCloudinary(existing.imagePublicId);
            } catch (err) {
              console.warn("Cloudinary delete failed:", err?.message || err);
            }
          }
        }
      } catch (err) {
        console.error("Update service error:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed"
        });
      }
    }

    // FINAL UPDATE (IMPORTANT 🔥)
    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Service updated successfully"
    });

  } catch (err) {
    console.error("Update service error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

    export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await Service.findById(id);
        if (!existing) {
            return res.status(404).json({ 
                success: false,
                 message: "Service not found"
                });
        }

        if (existing.imagePublicId) {
            try {
                await deleteFromCloudinary(existing.imagePublicId);
            } catch (err) {
                console.warn("Cloudinary delete failed:", err?.message || err);
            }
      }

      await existing.deleteOne();
      return res.status(200).json({
         success: true,
          message: "Service deleted successfully" 
        });
     } catch (err) {
        console.error("deleteService error:", err);
        return res.status(500).json({
           success: false, 
           message: "Server error"
           });
      }
    }