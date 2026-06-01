import { MedusaService } from "@medusajs/framework/utils"
import DigitalProduct from "./models/digital-product"
import DigitalProductDelivery from "./models/digital-product-delivery"

class DigitalProductModuleService extends MedusaService({
  DigitalProduct,
  DigitalProductDelivery,
}) {}

export default DigitalProductModuleService
