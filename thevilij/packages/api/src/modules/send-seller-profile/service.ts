import { MedusaService } from "@medusajs/framework/utils"
import SendSellerProfile from "./models/send-seller-profile"

class SendSellerProfileModuleService extends MedusaService({
  SendSellerProfile,
}) {}

export default SendSellerProfileModuleService
