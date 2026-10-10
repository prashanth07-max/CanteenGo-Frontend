const LABEL = { PENDING: 'Pending', PREPARING: 'Preparing', READY: 'Ready', COMPLETED: 'Completed' }
export default function StatusBadge({ status }) {
  return <span className={`status s-${status}`}>{LABEL[status] || status}</span>
}
