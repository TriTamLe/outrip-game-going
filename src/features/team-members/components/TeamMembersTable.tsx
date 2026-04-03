import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { teamMeta } from '../../team-scoreboard/teamMeta.ts'
import type { TeamMemberRecord } from '../teamMemberTypes.ts'

type TeamMembersTableProps = {
  teamMembers: TeamMemberRecord[]
  loading: boolean
  deletingId: TeamMemberRecord['_id'] | null
  onEdit: (teamMember: TeamMemberRecord) => void
  onDelete: (teamMember: TeamMemberRecord) => Promise<void>
}

const teamNameByKey = new Map(teamMeta.map((team) => [team.key, team.name]))

export function TeamMembersTable({
  teamMembers,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: TeamMembersTableProps) {
  const columns: TableColumnsType<TeamMemberRecord> = [
    {
      title: 'Team',
      dataIndex: 'teamKey',
      key: 'teamKey',
      width: 180,
      render: (teamKey: TeamMemberRecord['teamKey']) => (
        <Typography.Text className="text-[0.98rem] font-medium text-slate-900">
          {teamNameByKey.get(teamKey) ?? teamKey}
        </Typography.Text>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name: string) => (
        <Typography.Text className="text-[0.98rem] text-slate-900">
          {name}
        </Typography.Text>
      ),
    },
    {
      title: 'Leader',
      dataIndex: 'isLeader',
      key: 'isLeader',
      width: 120,
      render: (isLeader: boolean) =>
        isLeader ? <Tag color="gold">Leader</Tag> : null,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_value: unknown, record: TeamMemberRecord) => (
        <Space size="small">
          <Button
            className="!rounded-xl !px-3 !font-medium"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this team member?"
            okButtonProps={{ danger: true }}
            okText="Delete"
            onConfirm={() => onDelete(record)}
          >
            <Button
              className="!rounded-xl !px-3 !font-medium"
              danger
              icon={<DeleteOutlined />}
              loading={deletingId === record._id}
              type="text"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {teamMembers.map((record) => (
          <div
            className="rounded-[22px] border border-slate-200/80 bg-white/72 p-4 shadow-[0_12px_30px_rgba(148,163,184,0.12)]"
            key={record._id}
          >
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Team
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] font-medium text-slate-900">
                    {teamNameByKey.get(record.teamKey) ?? record.teamKey}
                  </Typography.Text>
                </div>

                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Name
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] text-slate-900">
                    {record.name}
                  </Typography.Text>
                </div>

                {record.isLeader ? (
                  <div className="grid gap-1 rounded-[16px] bg-amber-50/90 px-3 py-3">
                    <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-amber-700 uppercase">
                      Role
                    </Typography.Text>
                    <Typography.Text className="text-[1rem] font-medium text-amber-900">
                      Team Leader
                    </Typography.Text>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="!h-10 !rounded-2xl !font-medium"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete this team member?"
                  okButtonProps={{ danger: true }}
                  okText="Delete"
                  onConfirm={() => onDelete(record)}
                >
                  <Button
                    className="!h-10 !rounded-2xl !font-medium"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingId === record._id}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}

        {!loading && teamMembers.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            No team members yet.
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <Table<TeamMemberRecord>
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
          columns={columns}
          dataSource={teamMembers}
          loading={loading}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 820 }}
        />
      </div>
    </>
  )
}
