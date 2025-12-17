export function cn(
  ...inputs: Array<string | false | null | undefined | Array<string | false | null | undefined>>
) {
  const flat = inputs.flatMap((input) =>
    Array.isArray(input) ? input : [input],
  );
  return flat.filter(Boolean).join(" ");
}
