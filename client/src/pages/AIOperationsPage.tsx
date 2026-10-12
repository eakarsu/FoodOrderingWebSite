import AdvisoryWorkspace from '@/components/runtime-ai/AdvisoryWorkspace'
export default function AIOperationsPage() {
  return <AdvisoryWorkspace title="Order planning advice" description="Get a review of your order-planning question. Confirm ingredients, allergies, availability and payment with the restaurant before placing an order." endpoint="/api/ai/order-advice" field="prompt" fieldLabel="Order planning question" maxLength={5000} tokenStorage="food-ordering-token" examples={[
    { label: 'Dietary review', value: 'Prepare an order-planning checklist for a guest with dietary restrictions. Identify the actual ingredient and cross-contact information to request from the restaurant, menu availability checks, and questions requiring human confirmation. No allergy or menu facts have been supplied; do not invent them.' },
    { label: 'Group order', value: 'Review a group-order planning process before checkout. Cover collecting actual guest preferences, confirming portions and availability, dietary and allergy checks, pickup or delivery timing, and a final human confirmation. Give practical next steps; do not claim an order or payment was placed.' },
    { label: 'Pickup plan', value: 'Review a pickup-order planning workflow. List checks for actual item availability, ingredient and allergy questions, restaurant-confirmed preparation timing, total price and payment authorization, and the pickup handoff. Flag uncertainty and decisions requiring confirmation; execute no order or payment.' }
  ]}/>
}
