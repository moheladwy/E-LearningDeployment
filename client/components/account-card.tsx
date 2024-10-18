import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AccountCard = ({
  id,
  viewDetails,
  removeAccount,
  role,
  name,
}: {
  id: number;
  viewDetails: any;
  removeAccount: any;
  role: string;
  name: string;
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between w-full h-20 py-6 px-3">
        <div className="columns-1 items-center gap-2 pr-4">
          <p>Account ID: {id}</p>
          <p>Name: {name}</p>
          <p>Role: {role}</p>
        </div>
        <div className="flex gap-2">
          <Button className="success" onClick={() => viewDetails(id)}>
            View details
          </Button>
          <Button className="danger" onClick={() => removeAccount(id)}>
            Remove account
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { AccountCard };
