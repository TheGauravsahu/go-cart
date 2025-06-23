import ErrorOccured from "@/components/ErrorOccured";
import GradiantText from "@/components/GradiantText";
import Loader from "@/components/Loader";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAddresses } from "@/hooks/useAddress";
import { formatDate } from "@/lib/utils";
import { Address } from "@/types/address.types";
import DeleteAddressDialog from "./DeleteAddressDialog";
import AddAddress from "./AddAddress";
import EditAddressDialog from "./EditAddressDialog";

function ListAddresses() {
  const { data, isPending, isError } = useAddresses();

  const addresses = data?.data?.addresses || [];

  if (isPending) return <Loader />;
  if (isError) return <ErrorOccured />;

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold mb-6">
          Shipping <GradiantText text="Addresses" size="2xl" />
        </h1>
        <AddAddress />
      </div>
      <div className="w-full flex flex-col justify-center md:flex-row md:justify-normal items-center flex-wrap gap-4 pb-8">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressCard key={addr.address_id} addr={addr} />
          ))
        ) : (
          <div className="text-muted-foreground">No adddress added yet.</div>
        )}
      </div>
    </div>
  );
}

const AddressCard = ({ addr }: { addr: Address }) => {
  return (
    <Card
      key={addr.pincode}
      className="h-60 w-82 rounded-lg bg-pink-500/5 border transition-all duration-300 hover:border-pink-700 cursor-pointer"
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-pink-700">Address</h3>
          <CardAction className="flex gap-2">
            <EditAddressDialog addrId={addr.address_id} />
            <DeleteAddressDialog addrId={addr.address_id} />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        <p className="text-sm font-medium text-pink-900">
          {addr.house}, {addr.street}
        </p>
        <p className="text-sm">
          {addr.city}, {addr.state}
        </p>
        <p className="text-sm">PIN: {addr.pincode}</p>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Added on: {formatDate(addr.created_at)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ListAddresses;
