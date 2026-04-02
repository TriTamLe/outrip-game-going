import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { idiomTeams, type IdiomRecord } from '../idiomStatus.ts'
import { IdiomStatusTag } from './IdiomStatusTag.tsx'

type IdiomsTableProps = {
  idioms: IdiomRecord[]
  loading: boolean
  deletingId: IdiomRecord['_id'] | null
  onEdit: (idiom: IdiomRecord) => void
  onDelete: (idiom: IdiomRecord) => Promise<void>
}

export function IdiomsTable({
  idioms,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: IdiomsTableProps) {
  const columns: TableColumnsType<IdiomRecord> = [
    {
      title: 'Idiom',
      dataIndex: 'text',
      key: 'text',
      width: 420,
      render: (text: string) => (
        <Typography.Text className="whitespace-pre-wrap text-[0.98rem] text-slate-900">
          {text}
        </Typography.Text>
      ),
    },
    ...idiomTeams.map((team) => ({
      title: team.name,
      key: team.key,
      width: 160,
      render: (_value: unknown, record: IdiomRecord) => (
        <IdiomStatusTag value={record.status[team.key]} />
      ),
    })),
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_value: unknown, record: IdiomRecord) => (
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
            title="Delete this idiom?"
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
        {idioms.map((record) => (
          <div
            className="rounded-[22px] border border-slate-200/80 bg-white/72 p-4 shadow-[0_12px_30px_rgba(148,163,184,0.12)]"
            key={record._id}
          >
            <div className="grid gap-4">
              <Typography.Text className="whitespace-pre-wrap text-[1rem] leading-7 text-slate-900">
                {record.text}
              </Typography.Text>

              <div className="grid grid-cols-2 gap-2">
                {idiomTeams.map((team) => (
                  <div
                    className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-2"
                    key={team.key}
                  >
                    <Typography.Text className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {team.name}
                    </Typography.Text>
                    <IdiomStatusTag value={record.status[team.key]} />
                  </div>
                ))}
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
                  title="Delete this idiom?"
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

        {!loading && idioms.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            No idioms yet.
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <Table<IdiomRecord>
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
          columns={columns}
          dataSource={idioms}
          loading={loading}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1100 }}
        />
      </div>
    </>
  )
}
