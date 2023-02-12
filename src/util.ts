/** Transforms the values in a dictionary into strings and filters out falsey entries */
export function stringifyParamValues(params: ISearchParams | ITypeaheadParams) {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [key, String(value)])
      .filter(([key, value]) => !!value)
  )
}