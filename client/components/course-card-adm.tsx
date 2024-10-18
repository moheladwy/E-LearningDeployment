import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CourseRequestCard = ({
  id,
  onAccept,
  onReject,
}: {
  id: number;
  onAccept: any;
  onReject: any;
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between w-full h-20 py-6 px-3">
        <div className="flex items-center gap-2 pr-4">
          <p>Request for publishing course: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button className="success" onClick={() => onAccept(id)}>
            Accept
          </Button>
          <Button className="danger" onClick={() => onReject(id)}>
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { CourseRequestCard };
