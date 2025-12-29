import type { Meta, StoryObj } from '@storybook/react'
import { UserProfile } from './user-profile'

const meta: Meta<typeof UserProfile> = {
    title: 'UI/UserProfile',
    component: UserProfile,
    tags: ['autodocs'],
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
}

export default meta
type Story = StoryObj<typeof UserProfile>

export const WithImage: Story = {
    args: {
        name: 'John Doe',
        image: 'https://github.com/shadcn.png',
        subtitle: 'Linkhub',
    },
}

export const InitialOnly: Story = {
    args: {
        name: 'Jane Smith',
        subtitle: 'Free Account',
    },
}
