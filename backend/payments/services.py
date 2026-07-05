class MpesaService:
    @staticmethod
    def initiate_stk_push(phone_number, amount, order_id):
        # MOCK IMPLEMENTATION
        # In a real environment, this would call the actual Safaricom Daraja API.
        return {
            "ResponseCode": "0",
            "CustomerMessage": "Success. Request accepted for processing",
            "CheckoutRequestID": f"ws_CO_{order_id}_{phone_number}"
        }
