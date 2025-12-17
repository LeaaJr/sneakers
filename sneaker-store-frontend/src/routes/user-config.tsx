import { createFileRoute } from '@tanstack/react-router'
import UserConfigPage from '../components/user/UserConfigPage'

export const Route = createFileRoute('/user-config')({
  component: UserConfigPage,
})