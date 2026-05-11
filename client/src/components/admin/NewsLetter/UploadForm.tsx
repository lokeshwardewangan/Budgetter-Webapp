import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, X } from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import ReactSelect, { MultiValue, StylesConfig } from 'react-select';
import toast from 'react-hot-toast';
import { GetAppUsersDetails } from '@/services/adminAccess';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/api/admin/reports/userReports';
import { useTheme } from '@/shared/contexts/ThemeContext';

interface UploadFormProps {
  heading: string;
  setHeading: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePreviewClick: () => void;
  showEditor: boolean;
  setUsersEmails: (emails: string[]) => void;
}

interface Option {
  value: string;
  label: string;
}

const UploadForm: React.FC<UploadFormProps> = ({
  heading,
  setHeading,
  onFileChange,
  onTogglePreviewClick,
  showEditor,
  setUsersEmails,
}) => {
  const { isDarkMode } = useTheme();

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const { data } = useQuery({
    queryKey: ['appusers'],
    queryFn: () => GetAppUsersDetails(),
  });

  const getFilteredEmails = (): string[] => {
    const includedEmails = allUsers.filter(
      (user) => !excludedUsers.some((excluded) => excluded.value === user._id)
    );
    // console.log(includedEmails);
    const allEmails = [...includedEmails.map((user) => user.email), ...emails];
    return allEmails;
  };

  useEffect(() => {
    if (data?.data) {
      const fetchedUsers: any = data.data.map((user: User, index: number) => ({
        _id: Number(user._id) || 100 + index, // convert id to number or fallback
        name: user.name || user.username || 'Unknown User',
        email: user.email,
      }));
      setAllUsers(fetchedUsers);

      const includedEmails = fetchedUsers.filter(
        (user: any) =>
          !excludedUsers.some((excluded) => excluded.value === user._id)
      );
      // console.log(includedEmails);
      const allEmails = [
        ...includedEmails.map((user: any) => user.email),
        ...emails,
      ];
      setUsersEmails(allEmails);
    }
  }, [data]);

  const userOptions: Option[] = allUsers.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const [excludedUsers, setExcludedUsers] = useState<MultiValue<Option>>([]);

  const handleExcludeChange = (selected: MultiValue<Option>) => {
    setExcludedUsers(selected);
  };

  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  const handleAddEmail = () => {
    const trimmed = email.trim();
    if (
      trimmed &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
      !emails.includes(trimmed)
    ) {
      setEmails((prev) => [...prev, trimmed]);
      setEmail('');
    } else {
      toast.error('Invalid email address');
    }
  };

  const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRemoveEmail = (targetEmail: string) => {
    setEmails((prev) => prev.filter((email) => email !== targetEmail));
  };

  const commonReactSelectStyles: StylesConfig<Option, true> = {
    container: (base) => ({
      ...base,
      width: '100%',
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: isDarkMode ? '#10101c' : 'transparent',
      borderColor: state.isFocused
        ? '#3b82f6'
        : isDarkMode
          ? '#37415170'
          : '#d1d5db',
      boxShadow: 'none',
      padding: '0.02rem 0.6rem',
      borderRadius: '0.375rem',
      width: '100%',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      color: isDarkMode ? '#f9fafb' : '#111827',
    }),
    valueContainer: (base) => ({
      ...base,
      width: '100%',
      padding: 0,
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? '#f9fafb' : '#111827',
      margin: 0,
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      zIndex: 10,
      width: '100%',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? '#3b82f6'
        : isFocused
          ? isDarkMode
            ? '#374151'
            : '#e5e7eb'
          : 'transparent',
      color: isSelected ? '#ffffff' : isDarkMode ? '#f9fafb' : '#111827',
      cursor: 'pointer',
      fontSize: '14px',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#1e40af' : '#dbeafe', // blue-800 / blue-100
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDarkMode ? '#bfdbfe' : '#1e3a8a', // blue-200 / blue-900
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDarkMode ? '#bfdbfe' : '#1e3a8a', // match label color
      ':hover': {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
    }),
  };

  // whenever custom emails add and excluded users change then setUsersEmails
  useEffect(() => {
    const allEmails = getFilteredEmails();
    // console.log(allEmails);
    setUsersEmails(allEmails);
  }, [emails, excludedUsers]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Enter Subject of Newsletter *</Label>
        <Input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          type="text"
          placeholder="Enter Newsletter Subject"
          className="h-10"
        />
      </div>

      <div className="space-y-1">
        <div className="flex w-full items-center justify-between">
          <Label>Exclude Users</Label>
          <span className="text-xs">
            Excluded : {excludedUsers.length}/{userOptions.length}
          </span>
        </div>
        <ReactSelect
          isMulti
          options={userOptions}
          value={excludedUsers}
          onChange={handleExcludeChange}
          placeholder="Select users to exclude"
          styles={commonReactSelectStyles}
        />
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Additional Email to Send:</Label>
          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {emails.map((e, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {e}
                  <button
                    onClick={() => handleRemoveEmail(e)}
                    className="text-blue-800 transition-colors hover:text-red-600 focus:outline-none dark:text-blue-100 dark:hover:text-red-400"
                    aria-label={`Remove ${e}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Input
            id="email"
            type="text"
            value={email}
            placeholder="Enter Email"
            onChange={handleEmailChange}
            onKeyDown={handleEmailKeyDown}
            className="h-10"
          />
        </div>
      </div>

      <div className="flex w-fit flex-col gap-5">
        <input
          type="file"
          accept=".html"
          className="file:mr-3 file:rounded-full file:border-0 file:bg-green-600/80 file:p-1 file:px-5 file:text-sm file:text-white file:shadow-md hover:file:cursor-pointer"
          onChange={onFileChange}
        />

        <button
          onClick={onTogglePreviewClick}
          className="flex max-w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 px-5 py-1 text-sm font-medium text-white transition-transform duration-300 hover:bg-gradient-to-br hover:opacity-90"
        >
          <span>Preview HTML</span>
          {showEditor ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
