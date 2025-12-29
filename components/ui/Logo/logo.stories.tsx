import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './logo'

const meta: Meta<typeof Logo> = {
    title: 'UI/Logo',
    component: Logo,
    tags: ['autodocs'],
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
}

export default meta
type Story = StoryObj<typeof Logo>

export const Default: Story = {
    args: {
        letter: 'L',
        text: 'LinkHub',
    },
}

export const IconOnly: Story = {
    args: {
        letter: 'L',
        text: '',
    },
}
