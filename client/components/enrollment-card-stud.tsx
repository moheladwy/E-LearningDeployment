import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EnrollmentCardStud = ({
  enrollmentId,
  courseId,
  status,
  cancel,
}: {
  enrollmentId: number;
  courseId: number;
  status: string;
  cancel: any;
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between w-full h-20 py-6 px-3">
        <div className="flex items-center gap-2 pr-4">
          <p>Enrollment for course: {courseId}</p>
          <p>Status: {status}</p>
        </div>
        <Button onClick={() => cancel(enrollmentId)} className="w-30 h-10">
          Cancel Enrollment
        </Button>
      </div>
    </Card>
  );
};

export { EnrollmentCardStud };
