import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[--color-bc-surface]">
      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg border border-[--color-bc-border] rounded-2xl',
          },
        }}
      />
    </main>
  )
}
