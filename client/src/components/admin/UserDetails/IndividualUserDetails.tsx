import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User } from '@/types/api/admin/reports/userReports';
import { Eye } from 'lucide-react';

const IndividualUserDetails = ({ user }: { user: User }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          className="mt-2 w-full max-w-fit transform rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-3 text-white opacity-80 shadow-xl transition duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none"
        >
          <Eye className="mr-2 h-5 w-5" />
          Full Details
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-dvh overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">User Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="word_break text-xl font-semibold">
                {user?.name || 'NA'}
              </h2>
              <p className="word_break text-gray-500 dark:text-white">
                @{user?.username || 'NA'}
              </p>
            </div>
          </div>

          {/* Main Info */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <p className="text-gray-500 dark:text-white">Email</p>
              <p>{user?.email || 'NA'}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-white">Date of Birth</p>
              <p>{user?.dateOfBirth || 'NA'}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-white">Profession</p>
              <p>{user?.profession || 'NA'}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-white">
                Current Pocket Money
              </p>
              <p className="text-lg font-semibold">
                ₹{user?.currentPocketMoney || 'NA'}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-white">Status</p>
              <p>{user?.isVerified ? 'Verified User' : 'Not Verified'}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t pt-4">
            <p className="mb-2 text-gray-500 dark:text-white">Social Media</p>
            <div className="space-y-2">
              {user?.instagramLink ? (
                <a
                  href={user?.instagramLink}
                  className="block text-blue-600 hover:underline"
                >
                  Instagram Profile
                </a>
              ) : (
                <p className="text-gray-500 dark:text-white">NA</p>
              )}
              {user?.facebookLink ? (
                <a
                  href={user?.facebookLink}
                  className="block text-blue-600 hover:underline"
                >
                  Facebook Profile
                </a>
              ) : (
                <p className="text-gray-500 dark:text-white">NA</p>
              )}
            </div>
          </div>

          {/* Pocket money + lent money histories were removed when the
              server split them into their own collections. Per-user totals
              could be added later via a join endpoint if needed. */}

          {/* Dates */}
          <div className="border-t pt-4 text-sm text-gray-500 dark:text-white">
            <p>
              Member since:{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-GB')
                : 'NA'}
            </p>
            <p>
              Last updated:{' '}
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString('en-GB')
                : 'NA'}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IndividualUserDetails;
