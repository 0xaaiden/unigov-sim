/* eslint-disable */
'use client'
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from 'lucide-react'
import { ControllerRenderProps, DefaultValues, FieldValues, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { DatePicker } from './date-picker'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Separator } from './separator'
import { Switch } from './switch'
import { Textarea } from './textarea'

/**
 * Beautify a camelCase string.
 * e.g. "myString" -> "My String"
 */
function beautifyObjectName(string: string) {
  let output = string.replace(/([A-Z])/g, ' $1')
  output = output.charAt(0).toUpperCase() + output.slice(1)
  return output
}

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseSchema(schema: z.ZodAny | z.ZodEffects<z.ZodAny>): z.ZodAny {
  if ('innerType' in schema._def) {
    return getBaseSchema(schema._def.innerType as z.ZodAny)
  }
  if ('schema' in schema._def) {
    return getBaseSchema(schema._def.schema)
  }
  return schema as z.ZodAny
}

/**
 * Get the type name of the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseType(schema: z.ZodAny): string {
  return getBaseSchema(schema)._def.typeName
}

/**
 * Search for a "ZodDefult" in the Zod stack and return its value.
 */
function getDefaultValueInZodStack(schema: z.ZodAny): any {
  const typedSchema = schema as unknown as z.ZodDefault<z.ZodNumber | z.ZodString>

  if (typedSchema._def.typeName === 'ZodDefault') {
    return typedSchema._def.defaultValue()
  }

  if ('innerType' in typedSchema._def) {
    return getDefaultValueInZodStack(typedSchema._def.innerType as unknown as z.ZodAny)
  }
  if ('schema' in typedSchema._def) {
    return getDefaultValueInZodStack((typedSchema._def as any).schema as z.ZodAny)
  }
  return undefined
}

/**
 * Get all default values from a Zod schema.
 */
function getDefaultValues<Schema extends z.ZodObject<any, any>>(schema: Schema) {
  const { shape } = schema
  type DefaultValuesType = DefaultValues<Partial<z.infer<Schema>>>
  const defaultValues = {} as DefaultValuesType

  for (const key of Object.keys(shape)) {
    const item = shape[key] as z.ZodAny

    if (getBaseType(item) === 'ZodObject') {
      const defaultItems = getDefaultValues(item as unknown as z.ZodObject<any, any>)
      for (const defaultItemKey of Object.keys(defaultItems)) {
        const pathKey = `${key}.${defaultItemKey}` as keyof DefaultValuesType
        defaultValues[pathKey] = defaultItems[defaultItemKey]
      }
    } else {
      const defaultValue = getDefaultValueInZodStack(item)
      if (defaultValue !== undefined) {
        defaultValues[key as keyof DefaultValuesType] = defaultValue
      }
    }
  }

  return defaultValues
}

function getObjectFormSchema(schema: ZodObjectOrWrapped): z.ZodObject<any, any> {
  if (schema._def.typeName === 'ZodEffects') {
    const typedSchema = schema as z.ZodEffects<z.ZodObject<any, any>>
    return getObjectFormSchema(typedSchema._def.schema)
  }
  return schema as z.ZodObject<any, any>
}

/**
 * Convert a Zod schema to HTML input props to give direct feedback to the user.
 * Once submitted, the schema will be validated completely.
 */
function zodToHtmlInputProps(
  schema: z.ZodNumber | z.ZodString | z.ZodOptional<z.ZodNumber | z.ZodString> | any
): React.InputHTMLAttributes<HTMLInputElement> {
  if (['ZodOptional', 'ZodNullable'].includes(schema._def.typeName)) {
    const typedSchema = schema as z.ZodOptional<z.ZodNumber | z.ZodString>
    return {
      ...zodToHtmlInputProps(typedSchema._def.innerType),
      required: false,
    }
  }

  const typedSchema = schema as z.ZodNumber | z.ZodString

  if (!('checks' in typedSchema._def)) return {}

  const { checks } = typedSchema._def
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    required: true,
  }
  const type = getBaseType(schema)

  for (const check of checks) {
    if (check.kind === 'min') {
      if (type === 'ZodString') {
        inputProps.minLength = check.value
      } else {
        inputProps.min = check.value
      }
    }
    if (check.kind === 'max') {
      if (type === 'ZodString') {
        inputProps.maxLength = check.value
      } else {
        inputProps.max = check.value
      }
    }
  }

  return inputProps
}

export type FieldConfigItem = {
  description?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  fieldType?: keyof typeof INPUT_COMPONENTS | React.FC<AutoFormInputComponentProps>

  renderParent?: (props: { children: React.ReactNode }) => React.ReactElement | null
}

export type FieldConfig<SchemaType extends z.infer<z.ZodObject<any, any>>> = {
  // If SchemaType.key is an object, create a nested FieldConfig, otherwise FieldConfigItem
  [Key in keyof SchemaType]?: SchemaType[Key] extends object ? FieldConfig<z.infer<SchemaType[Key]>> : FieldConfigItem
}

/**
 * A FormInput component can handle a specific Zod type (e.g. "ZodBoolean")
 */
export type AutoFormInputComponentProps = {
  zodInputProps: React.InputHTMLAttributes<HTMLInputElement>
  field: ControllerRenderProps<FieldValues, any>
  fieldConfigItem: FieldConfigItem
  label: string
  isRequired: boolean
  fieldProps: any
  zodItem: z.ZodAny
}

function AutoFormInput({ label, isRequired, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <Input type="text" {...fieldProps} />
      </FormControl>
      {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

function AutoFormNumber({ fieldProps, ...props }: AutoFormInputComponentProps) {
  return (
    <AutoFormInput
      fieldProps={{
        type: 'number',
        ...fieldProps,
      }}
      {...props}
    />
  )
}

function AutoFormTextarea({ label, isRequired, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <Textarea {...fieldProps} />
      </FormControl>
      {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

function AutoFormCheckbox({ label, isRequired, field, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} {...fieldProps} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          {label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      </div>
    </FormItem>
  )
}

function AutoFormSwitch({ label, isRequired, field, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} {...fieldProps} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          {label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      </div>
    </FormItem>
  )
}

function AutoFormRadioGroup({ label, isRequired, field, zodItem, fieldProps }: AutoFormInputComponentProps) {
  const values = (zodItem as unknown as z.ZodEnum<any>)._def.values

  return (
    <FormItem className="space-y-3">
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <RadioGroup className="flex flex-col space-y-1" defaultValue={field.value} onValueChange={field.onChange} {...fieldProps}>
          {values.map((value: any) => (
            <FormItem key={value} className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value={value} />
              </FormControl>
              <FormLabel className="font-normal">{value}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

function AutoFormDate({ label, isRequired, field, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <DatePicker date={field.value} setDate={field.onChange} {...fieldProps} />
      </FormControl>
      {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

function AutoFormEnum({ label, isRequired, field, fieldConfigItem, zodItem }: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def.values

  let values: [string, string][] = []
  if (!Array.isArray(baseValues)) {
    values = Object.entries(baseValues)
  } else {
    values = baseValues.map((value) => [value, value])
  }

  function findItem(value: any) {
    return values.find((item) => item[0] === value)
  }

  return (
    <FormItem>
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        <Select defaultValue={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue className="w-full" placeholder={fieldConfigItem.inputProps?.placeholder}>
              {field.value ? findItem(field.value)?.[1] : 'Select an option'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {values.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      {fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

const INPUT_COMPONENTS = {
  checkbox: AutoFormCheckbox,
  date: AutoFormDate,
  select: AutoFormEnum,
  radio: AutoFormRadioGroup,
  switch: AutoFormSwitch,
  textarea: AutoFormTextarea,
  number: AutoFormNumber,
  fallback: AutoFormInput,
}

/**
 * Define handlers for specific Zod types.
 * You can expand this object to support more types.
 */
const DEFAULT_ZOD_HANDLERS: {
  [key: string]: keyof typeof INPUT_COMPONENTS
} = {
  ZodBoolean: 'checkbox',
  ZodDate: 'date',
  ZodEnum: 'select',
  ZodNativeEnum: 'select',
  ZodNumber: 'number',
}

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function AutoFormObject<SchemaType extends z.ZodObject<any, any>>({
  schema,
  form,
  fieldConfig,
  path = [],
}: {
  schema: SchemaType
  form: ReturnType<typeof useForm>
  fieldConfig?: FieldConfig<z.infer<SchemaType>>
  path?: string[]
}) {
  const { shape } = schema

  return (
    <Accordion className="space-y-5" type="multiple">
      {Object.keys(shape).map((name) => {
        const item = shape[name] as z.ZodAny
        const zodBaseType = getBaseType(item)
        const itemName = item._def.description ?? beautifyObjectName(name)
        const key = [...path, name].join('.')

        if (zodBaseType === 'ZodObject') {
          return (
            <AccordionItem key={key} value={name}>
              <AccordionTrigger>{itemName}</AccordionTrigger>
              <AccordionContent className="p-2">
                <AutoFormObject
                  fieldConfig={(fieldConfig?.[name] ?? {}) as FieldConfig<z.infer<typeof item>>}
                  form={form}
                  path={[...path, name]}
                  schema={item as unknown as z.ZodObject<any, any>}
                />
              </AccordionContent>
            </AccordionItem>
          )
        }
        if (zodBaseType === 'ZodArray') {
          return <AutoFormArray key={key} form={form} item={item as unknown as z.ZodArray<any>} name={name} path={[...path, name]} />
        }

        const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {}
        const zodInputProps = zodToHtmlInputProps(item)
        const isRequired = zodInputProps.required ?? fieldConfigItem.inputProps?.required ?? false

        return (
          <FormField
            key={key}
            control={form.control}
            name={key}
            render={({ field }) => {
              const inputType = fieldConfigItem.fieldType ?? DEFAULT_ZOD_HANDLERS[zodBaseType] ?? 'fallback'

              const InputComponent = typeof inputType === 'function' ? inputType : INPUT_COMPONENTS[inputType]
              const ParentElement = fieldConfigItem.renderParent ?? DefaultParent

              return (
                <ParentElement key={`${key}.parent`}>
                  <InputComponent
                    field={field}
                    fieldConfigItem={fieldConfigItem}
                    isRequired={isRequired}
                    label={itemName}
                    zodInputProps={zodInputProps}
                    zodItem={item}
                    fieldProps={{
                      ...zodInputProps,
                      ...field,
                      ...fieldConfigItem.inputProps,
                      value: !fieldConfigItem.inputProps?.defaultValue ? field.value ?? '' : undefined,
                    }}
                  />
                </ParentElement>
              )
            }}
          />
        )
      })}
    </Accordion>
  )
}

function AutoFormArray({ name, item, form, path = [] }: { name: string; item: z.ZodArray<any>; form: ReturnType<typeof useForm>; path?: string[] }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  })
  const title = item._def.description ?? beautifyObjectName(name)

  return (
    <AccordionItem value={name}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="border-l p-3 pl-6">
        {fields.map((_field, index) => {
          const key = [...path, index.toString()].join('.')
          return (
            <div key={`${key}`} className="mb-4 grid gap-6">
              <AutoFormObject form={form} path={[...path, index.toString()]} schema={item._def.type as z.ZodObject<any, any>} />
              <Button size="icon" type="button" variant="secondary" onClick={() => remove(index)}>
                <Trash className="h-4 w-4" />
              </Button>
              <Separator />
            </div>
          )
        })}
        <Button className="flex items-center" type="button" onClick={() => append({})}>
          <Plus className="mr-2" size={16} />
          Add
        </Button>
      </AccordionContent>
    </AccordionItem>
  )
}

export function AutoFormSubmit({ children }: { children?: React.ReactNode }) {
  return <Button type="submit">{children ?? 'Submit'}</Button>
}

// TODO: This should support recursive ZodEffects but TypeScript doesn't allow circular type definitions.
export type ZodObjectOrWrapped = z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
}: {
  formSchema: SchemaType
  values?: Partial<z.infer<SchemaType>>
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
  onSubmit?: (values: z.infer<SchemaType>) => void
  fieldConfig?: FieldConfig<z.infer<SchemaType>>
  children?: React.ReactNode
  className?: string
}) {
  const objectFormSchema = getObjectFormSchema(formSchema)
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> = getDefaultValues(objectFormSchema)

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: valuesProp,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, 'these are the parsed values')
    const parsedValues = formSchema.safeParse(values)
    if (parsedValues.success) {
      onSubmitProp?.(parsedValues.data)
      console.log('Form submitted', parsedValues.data)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('space-y-5', className)}
        onChange={() => {
          const values = form.getValues()
          console.log('values', values)
          onValuesChangeProp?.(values)
          const parsedValues = formSchema.safeParse(values)
          if (parsedValues.success) {
            onParsedValuesChange?.(parsedValues.data)
          }
        }}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(onSubmit)(e)
          e.stopPropagation()
        }}>
        <AutoFormObject fieldConfig={fieldConfig} form={form} schema={objectFormSchema} />

        {children}
      </form>
    </Form>
  )
}

export default AutoForm
