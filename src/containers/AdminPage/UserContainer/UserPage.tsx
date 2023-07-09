import { Card } from '@mui/material';
import UserPageContent from './UserPageContent';
import { subDays } from 'date-fns';

function UserPage() {
 

  return (
    <Card>
      <UserPageContent />
    </Card>
  );
}

export default UserPage;
