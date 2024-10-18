import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EnrollmentCard = ({
  enrollmentId,
  courseId,
  studentId,
  onAccept,
  onReject,
}: {
  enrollmentId: number;
  courseId: number;
  studentId: number;
  onAccept: any;
  onReject: any;
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between w-full h-20 py-6 px-3">
        <div className="flex items-center gap-2 pr-4">
          <p>Enrollment for course: {courseId}</p>
          <p>From Student: {studentId}</p>
        </div>
        <div className="flex gap-2">
          <Button className="success" onClick={() => onAccept(enrollmentId)}>
            Accept
          </Button>
          <Button className="danger" onClick={() => onReject(enrollmentId)}>
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { EnrollmentCard };
