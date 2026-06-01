import { MedusaService } from "@medusajs/framework/utils"
import ReviewChecklist from "./models/review-checklist"

class SendReviewModuleService extends MedusaService({
  ReviewChecklist,
}) {}

export default SendReviewModuleService
