import ReactAvatar from 'react-avatar'

export default function Avatar({ user, size = '32' }) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || undefined

  return (
    <ReactAvatar
      name={name}
      src={user?.avatarUrl}
      size={size}
      round
      maxInitials={2}
      color="#0058be"
    />
  )
}
