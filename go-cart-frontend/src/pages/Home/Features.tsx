import { Truck, ShieldCheck, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    title: "Fast Delivery",
    description:
      "Get your products delivered to your doorstep in record time with real-time tracking.",
    icon: <Truck className="h-8 w-8 text-primary" />,
  },
  {
    title: "Secure Payments",
    description:
      "Your payments are 100% safe with our end-to-end encrypted checkout system.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
  },
  {
    title: "Wide Product Range",
    description:
      "From electronics to fashion, explore thousands of curated products across categories.",
    icon: <ShoppingBag className="h-8 w-8 text-primary" />,
  },
];

function Features() {
  return (
    <section className="pb-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Shop with GoCart?</h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover how GoCart makes your shopping experience easier, faster, and
          more secure.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
