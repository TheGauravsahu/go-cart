import ErrorOccured from "@/components/ErrorOccured";
import GradiantText from "../../components/GradiantText";
import Loader from "../../components/Loader";
import { useProducts, useSearchProducts } from "../../hooks/useProduct";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(urlSearch);

  const { data: products, isPending, isError } = useProducts();
  const { data: searchResults, isError: searchError } =
    useSearchProducts(urlSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: query.trim() });
  };

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  if (isPending) return <Loader />;
  if (isError || searchError) return <ErrorOccured />;

  const displayedProducts = urlSearch
    ? searchResults?.data?.products
    : products;

  return (
    <div className="p-4 md:px-12 h-full w-full pb-16">
      <h1 className="text-4xl font-bold my-2">
        Latest
        <GradiantText text="Products" size="3xl" />
      </h1>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl my-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Products"
          />
          <Button variant="secondary" className="cursor-pointer">
            <Search />
          </Button>
        </form>
      </div>

      <div className="h-full w-full md:container flex flex-col md:flex-row flex-wrap gap-8 items-center justify-center md:justify-normal mt-8">
        {displayedProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
