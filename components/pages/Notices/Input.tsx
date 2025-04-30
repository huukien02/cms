import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useFormContext, SubmitHandler } from "react-hook-form";
import { NoticeContent } from '@/types';
import apiConfig from '@/apiConfig';

const Input = () => {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState<NoticeContent | null>(null);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${apiConfig.baseUrl}/notices/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNotice(data);
        setValue("title", data.title);
        setValue("content", data.content);
      } else {
        console.error('Failed to fetch notice details');
      }
    } catch (error) {
      console.error('Error fetching notice details:', error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue
  } = useFormContext<NoticeContent>();

  const onSubmit: SubmitHandler<NoticeContent> = async (data) => {
    router.push(`/notices/${id}?confirm=check`);
  };

  if (!notice) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/admins/notices/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Redirect to the list of notices after successful delete
        router.push('/notices');
      } else {
        console.error('Failed to delete notice');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <>
      <h1>お知らせ編集</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            {...register("title")}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <p>お問い合わせ内容</p>
          <textarea
            className="input-textarea"
            {...register("content")}
          />
          {errors.content && <p>{errors.content.message}</p>}
        </div>

        <div className="form-actionArea">
          {!isValid && (
            <>
              <p>
                まだ全ての必須項目の入力が完了していません。
              </p>
            </>
          )}
          <div>
            <button type="submit">
              入力内容を確認する
            </button>
          </div>
        </div>
      </form>
      <button onClick={handleDelete}>削除する</button>
    </>
  );
};

export default Input;
