import { MedusaService } from "@medusajs/framework/utils"
import HomepageSlot from "./models/homepage-slot"

class HomepageSlotsModuleService extends MedusaService({
  HomepageSlot,
}) {}

export default HomepageSlotsModuleService
