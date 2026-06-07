import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-bc-surface]">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg border border-[--color-bc-border] rounded-2xl',
          },
        }}
      />
    </div>
  )
}
