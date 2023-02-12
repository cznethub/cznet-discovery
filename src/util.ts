/** Transforms the values in a dictionary into strings and filters out falsey entries */
export function stringifyParamValues(params: ISearchParams | ITypeaheadParams):
{ [key:string]: string } {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => [key, String(value)])
  )
}