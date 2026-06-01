import { Module } from "@medusajs/framework/utils"
import SendReviewModuleService from "./service"

export const SEND_REVIEW_MODULE = "send_review"

export default Module(SEND_REVIEW_MODULE, {
  service: SendReviewModuleService,
})
