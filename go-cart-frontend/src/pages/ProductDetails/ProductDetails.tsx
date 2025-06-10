import { Product } from "@/types/product.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <Accordion type="single" collapsible className="border-b">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">Description</AccordionTrigger>
          <AccordionContent>{product.description}</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="border-b">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">
            Product Details
          </AccordionTrigger>
          <AccordionContent>
            {product.details ? (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.details.fabric && (
                  <li>
                    <strong>Fabric:</strong> {product.details.fabric}
                  </li>
                )}
                {product.details.material && (
                  <li>
                    <strong>Material:</strong> {product.details.material}
                  </li>
                )}
                {product.details.weight && (
                  <li>
                    <strong>Weight:</strong> {product.details.weight}
                  </li>
                )}
                {product.details.sizes?.length > 0 && (
                  <li>
                    <strong>Sizes:</strong> {product.details.sizes.join(", ")}
                  </li>
                )}
                {product.details.color && (
                  <li>
                    <strong>Color:</strong> {product.details.color}
                  </li>
                )}
                {product.details.gender && (
                  <li>
                    <strong>Gender:</strong> {product.details.gender}
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional details available.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg">
            Additional Information
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                <strong>Category:</strong> {product.category}
              </li>
              <li>
                <strong>Stock:</strong> {product.stock}
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
export default ProductDetails