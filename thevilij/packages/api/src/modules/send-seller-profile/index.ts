import { Module } from "@medusajs/framework/utils"
import SendSellerProfileModuleService from "./service"

export const SEND_SELLER_PROFILE_MODULE = "send_seller_profile"

export default Module(SEND_SELLER_PROFILE_MODULE, {
  service: SendSellerProfileModuleService,
})
