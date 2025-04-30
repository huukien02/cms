import { useEffect, useState } from 'react'
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import CardComponent from '@/components/common/Card'
import 'react-datepicker/dist/react-datepicker.css'
import { axiosInstanceSystemAdmin } from '@/libs'
import { OrganizationType } from '.'
import { USER_ROLE } from '@/common/auth'
import Button from '@/components/Button'
import Loading from '@/components/Loading'

const TitleWrap = Styled.div`
  display: flex;
  width: auto;
  margin: 0 20% 0 0;
  justify-content: space-between;
`
const PageTitle = Styled.h1`
  font-size: 17px;
  font-weight: bold;
  margin: 0.5rem;
`
const FormContainer = Styled.div`
  margin-top: 50px;
  margin-bottom: 30px;
`
const DetailOrganizationInfo = Styled.div`
  display: flex;
  flex-direction: column;
`

const DetailOrganization = () => {
  const router = useRouter()
  const { organization_id } = router.query
  const [organization, setOrganization] = useState<OrganizationType>()

  useEffect(() => {
    fetchOrganization()
  }, [organization_id])

  const fetchOrganization = async () => {
    if (organization_id) {
      try {
        const response = await axiosInstanceSystemAdmin.get(
          `/api/system_admin/1.0/organizations/${organization_id}`,
        )
        const data = response.data.data
        setOrganization(data)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(
      `/system-admin/organization/edit?organization_id=${organization_id}`,
    )
  }

  if (!organization) {
    return <Loading />
  }

  return (
    <>
      <CardComponent>
        <TitleWrap>
          <PageTitle>事業詳細</PageTitle>
        </TitleWrap>

        <FormContainer>
          <form>
            <DetailOrganizationInfo>
              {/* name */}
              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  事業名
                </div>
                <div>{organization?.name}</div>
              </div>

              {/* login_url */}
              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  ディレクトリ
                </div>
                <div>{organization?.login_url}</div>
              </div>

              {/* logo_url */}
              <div className="flex min-h-[110px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[110px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  ロゴ
                </div>
                <div className="h-full">
                  <img
                    className="h-[90px]"
                    src={
                      organization?.logo_url ? organization.logo_url : undefined
                    }
                    alt=""
                  />
                </div>
              </div>

              {/* color */}
              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  ディレクトリ
                </div>
                {organization?.primary_color && (
                  <div className="flex gap-[20px]">
                    <div className="flex items-center gap-[10px] ">
                      <div
                        className="h-[40px] w-[40px]  rounded-[5px]"
                        style={{
                          backgroundColor:
                            organization?.primary_color ?? '#000000',
                        }}
                      />
                      <div>
                        <p className="bold text-[12px]">メインカラー</p>
                        <p className="text-[16px] font-[300] text-[#6B7280]">
                          {organization?.primary_color}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[10px] ">
                      <div
                        className="h-[40px] w-[40px]  rounded-[5px]"
                        style={{
                          backgroundColor:
                            organization?.secondary_color ?? '#000000',
                        }}
                      />
                      <div>
                        <p className="bold text-[12px]">サブカラー</p>
                        <p className="text-[16px] font-[300] text-[#6B7280]">
                          {organization?.secondary_color}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[10px] ">
                      <div
                        className="h-[40px] w-[40px]  rounded-[5px]"
                        style={{
                          backgroundColor:
                            organization?.tertiary_color ?? '#000000',
                        }}
                      />
                      <div>
                        <p className="bold text-[12px]">背景</p>
                        <p className="text-[16px] font-[300] text-[#6B7280]">
                          {organization?.tertiary_color}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* note */}
              {organization?.edit_options &&
                JSON.parse(organization?.edit_options).map(
                  (item: any, index: number) => (
                    <div key={index}>
                      <p className="flex min-h-[80px] items-center text-[16px] font-[600]">
                        追加項目 {index + 1}
                      </p>

                      <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                        <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                          項目名
                        </div>
                        <div>{item.f_name}</div>
                      </div>

                      <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                        <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                          項目種類
                        </div>
                        <div>
                          {item.f_type == 'pulldown'
                            ? 'プルダウン'
                            : 'テキスト入力'}
                        </div>
                      </div>

                      {item.f_type == 'pulldown' && (
                        <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                          <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                            プルダウン
                          </div>
                          <div>{item.f_options.join(', ')}</div>
                        </div>
                      )}
                    </div>
                  ),
                )}

              {/* S3 */}
              <p className="flex min-h-[80px] items-center text-[16px] font-[600]">
                RDS/S3情報
              </p>

              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  DBインスタンスタイプ
                </div>
                <div>{organization?.s3_info?.bucket_name}</div>
              </div>

              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  DBインスタンスID
                </div>
                <div>{organization?.s3_info?.access_key_id}</div>
              </div>

              <div className="flex min-h-[60px] items-center gap-[20px] border-b-[1px] border-[#DADADD]">
                <div className="flex h-[60px] w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px] font-[600px]">
                  接続タイプ（内部/外部）
                </div>
                <div>{organization?.s3_info?.creation_type}</div>
              </div>

              {/* Account */}
              <p className="flex min-h-[80px] items-center text-[16px] font-[600]">
                管理者アカウント
              </p>

              <div className="flex items-stretch gap-[20px] border-b border-[#DADADD] ">
                <div className="flex w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px]">
                  管理者アカウント
                </div>
                <div className="flex flex-col gap-1 py-5">
                  {organization?.user_orgs.map(
                    (user: { role: string; email: string }, index: number) =>
                      user.role === USER_ROLE.SYSTEM_ADMINISTRATOR && (
                        <p key={index}>{user.email}</p>
                      ),
                  )}
                </div>
              </div>

              <div className="flex items-stretch gap-[20px] border-b border-[#DADADD] ">
                <div className="flex w-[200px] items-center justify-center bg-[#F9FAFB] text-[12px]">
                  事務局
                </div>
                <div className="flex flex-col gap-1 py-5">
                  {organization?.user_orgs.map(
                    (user: { role: string; email: string }, index: number) =>
                      user.role === USER_ROLE.SECRETARIAT && (
                        <p key={index}>{user.email}</p>
                      ),
                  )}
                </div>
              </div>
            </DetailOrganizationInfo>
          </form>
        </FormContainer>

        <div className="flex items-center justify-center gap-[20px]">
          <Button
            w="w-[250px]"
            h="h-[50px]"
            color="text-[#A6ADBA]"
            borderColor="border-[#D3D3D3]"
            onClick={handleCancel}
          >
            戻る
          </Button>

          <Button
            w="w-[250px]"
            h="h-[50px]"
            color="text-[#FFFFFF]"
            borderColor="border-[#F57D14]"
            bg="bg-[#F57D14]"
            onClick={handleEdit}
          >
            編集する
          </Button>
        </div>
      </CardComponent>
    </>
  )
}

export default DetailOrganization
