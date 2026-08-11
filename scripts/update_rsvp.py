from pathlib import Path

path = Path('src/routes/index.tsx')
text = path.read_text()

for name in range(1, 7):
    text = text.replace(f'import g{name} from "@/assets/g{name}.jpg";\n', '')

text = text.replace(
    'import { submitRsvp } from "@/lib/rsvp.functions";\n',
    'import { submitRsvp } from "@/lib/rsvp.functions";\nimport { supabase } from "@/integrations/supabase/client";\n',
    1,
)

text = text.replace(
    '  const [error, setError] = useState("");\n  const sendRsvp = useServerFn(submitRsvp);',
    '''  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const sendRsvp = useServerFn(submitRsvp);''',
    1,
)

old = '''    const form = new FormData(e.currentTarget as HTMLFormElement);
    setSending(true);
    setError("");
    try {
      await sendRsvp({'''
new = '''    const form = new FormData(e.currentTarget as HTMLFormElement);
    const phone = String(form.get("phone") ?? "").trim();
    setSending(true);
    setError("");

    if (!phone) {
      setSending(false);
      setError("Please enter your cellphone number for verification.");
      return;
    }

    if (!verified || verifiedPhone !== phone) {
      try {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone,
          options: { shouldCreateUser: true },
        });
        if (otpError) throw otpError;
        setVerificationSent(true);
        setSending(false);
        return;
      } catch (err) {
        console.error(err);
        setSending(false);
        setError("We couldn't send the verification code. Please check the cellphone number and try again.");
        return;
      }
    }

    try {
      await sendRsvp({'''
if old not in text:
    raise SystemExit('submit block not found')
text = text.replace(old, new, 1)
text = text.replace('          phone: String(form.get("phone") ?? "").trim(),', '          phone,', 1)

marker = '''                  <div>
                    <LabelText>Attendance</LabelText>'''
verification_ui = '''                  {verificationSent && !verified ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-2xl border border-champagne/70 bg-warm/50 p-6"
                    >
                      <LabelText>Verification Code</LabelText>
                      <p className="mt-2 text-sm font-light text-charcoal/70">
                        We sent a 6-digit verification code to your cellphone. Enter it below to confirm your number.
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <input
                          value={verificationCode}
                          onChange={(ev) => setVerificationCode(ev.target.value.replace(/\\D/g, "").slice(0, 6))}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="000000"
                          className="w-full border-b border-champagne bg-transparent py-3 font-serif text-xl tracking-[0.4em] text-charcoal outline-none focus:border-gold"
                        />
                        <button
                          type="button"
                          disabled={verifying || verificationCode.length !== 6}
                          onClick={async () => {
                            const phone = String((document.getElementById("phone") as HTMLInputElement)?.value ?? "").trim();
                            if (!phone || verificationCode.length !== 6) return;
                            setVerifying(true);
                            setError("");
                            try {
                              const { error: otpError } = await supabase.auth.verifyOtp({
                                phone,
                                token: verificationCode,
                                type: "sms",
                              });
                              if (otpError) throw otpError;
                              setVerified(true);
                              setVerifiedPhone(phone);
                              setVerificationSent(false);
                              setVerificationCode("");
                            } catch (err) {
                              console.error(err);
                              setError("That verification code is not valid. Please try again.");
                            } finally {
                              setVerifying(false);
                            }
                          }}
                          className="rounded-full border border-gold px-6 py-3 text-[0.65rem] uppercase tracking-[0.3em] text-charcoal transition-all hover:bg-gold hover:text-warm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {verifying ? "Verifying…" : "Verify"}
                        </button>
                      </div>
                    </motion.div>
                  ) : null}

                  {verified ? (
                    <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
                      <Check className="h-4 w-4" strokeWidth={1.5} />
                      Cellphone verified
                    </div>
                  ) : null}

'''
if marker not in text:
    raise SystemExit('attendance marker not found')
text = text.replace(marker, verification_ui + marker, 1)

text = text.replace(
    '<Field label="Phone" name="phone" type="tel" />',
    '''<Field
                      label="Phone / Cellphone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+27 82 123 4567"
                      onChange={() => {
                        setVerified(false);
                        setVerificationSent(false);
                        setVerifiedPhone("");
                      }}
                    />''',
    1,
)

old_props = '''  required?: boolean;
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}'''
new_props = '''  required?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}'''
if old_props not in text:
    raise SystemExit('Field props block not found')
text = text.replace(old_props, new_props, 1)
text = text.replace(
    '        required={required}\n        className="mt-3',
    '        required={required}\n        placeholder={placeholder}\n        onChange={onChange}\n        className="mt-3',
    1,
)

path.write_text(text)
print('Updated RSVP UI and removed gallery asset imports.')
