import { useRouter } from "next/router";
import { useFormContext, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { NoticeContent } from "@/types";
import apiConfig from "@/apiConfig";

const Confirm = () => {
  const router = useRouter();
  const id = router.query.id;

  const {
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useFormContext<NoticeContent>();

  const values = getValues();

  if (!isValid) {
    router.push(`/`);
  }

  const onSubmit: SubmitHandler<NoticeContent> = async (data) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/admins/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log(response);
        router.push("/notices");
      } else {
        console.error("Failed to update notice");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <p>タイトル</p>
              <p>{values.title}</p>
            </div>
          </div>

          <div>
            <div>
              <p>内容</p>
              <p>{values.content}</p>
            </div>
          </div>
          <div>
            <button type="submit">送信する</button>
            <button type="button" onClick={goBack}>
              入力内容を修正する
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Confirm;
