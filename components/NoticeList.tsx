import React from 'react';
import Link from 'next/link';

interface Notice {
  id: number;
  title: string;
}

interface NoticeListProps {
  notices: Notice[];
  onEdit: (editedNotice: Notice) => void;
  onDelete: (id: number) => void;
}

const NoticeList: React.FC<NoticeListProps> = ({ notices, onEdit, onDelete }) => {
  return (
    <ul>
      {notices.map((notice) => (
        <li key={notice.id}>
          <Link href={`/notices/${notice.id}`}>
            {notice.title}
          </Link>
          <button onClick={() => onEdit(notice)}>編集</button>
          <button onClick={() => onDelete(notice.id)}>削除</button>
        </li>
      ))}
    </ul>
  );
};

export default NoticeList;
