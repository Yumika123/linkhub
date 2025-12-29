import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from '../Button/button'
import React from 'react'

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This is the main content of the card.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button variant="brand">Deploy</Button>
            </CardFooter>
        </Card>
    ),
}
