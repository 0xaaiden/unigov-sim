'use client'
import { useEffect, useState } from 'react'

import { v4 } from 'uuid'

import AutoForm, { AutoFormSubmit, FieldConfig, ZodObjectOrWrapped } from '@/components/ui/auto-form'
import { generateZodSchemaForFunction } from '@/lib/generateSchema'
import { tag, tags } from '@/lib/types/types'

// Define your form schema using zod

export default function FormGen({
  value,
  setTags,
  tags,
  contractAbi,
  chosenFnc,
  address,
  setOpen,
}: {
  value: string

  setTags: (tags: any) => void
  tags: tags
  chosenFnc: string
  address: string
  contractAbi: any[]
  setOpen: (open: boolean) => void
}) {
  const [formSchema, setFormSchema] = useState<ZodObjectOrWrapped>()
  const [fieldConfig, setFieldConfig] = useState<{ [k: string]: string }>({})

  useEffect(() => {
    if (value.length > 1) {
      const { zodSchema, fieldConfig } = generateZodSchemaForFunction(value)
      setFormSchema(zodSchema)
      setFieldConfig(fieldConfig)
    }
  }, [value])

  return formSchema && fieldConfig ? (
    // Pass the schema to the form
    <AutoForm
      fieldConfig={fieldConfig as any}
      formSchema={formSchema}
      onSubmit={(values) => {
        const valuesArray = Object.entries(values)
        const valuesTfmd = valuesArray.map(([name, value]) => {
          return { name: name, value: value }
        })
        const newTags = [
          ...tags,
          {
            uuid: v4(),
            value: value,
            address: address,
            contractAbi: contractAbi,
            function: chosenFnc,
            params: valuesTfmd,
          },
        ]
        setTags(newTags)
        setOpen(false)
      }}>
      <div
        //justify right
        className="flex justify-end">
        <AutoFormSubmit>Add Function</AutoFormSubmit>
      </div>

      {/*
      All children passed to the form will be rendered below the form.
      */}
    </AutoForm>
  ) : null
}

export function FormGenEdit({
  editingTag,
  setTags,
  tags,
  setOpen,
}: {
  editingTag: string
  setTags: (tags: any) => void
  tags: tags
  setOpen: (open: boolean) => void
}) {
  const [formSchema, setFormSchema] = useState<ZodObjectOrWrapped>()
  const [fieldConfig, setFieldConfig] = useState<any>({})
  const [editingTagOrig, setEditingTag] = useState<tag>()

  useEffect(() => {
    if (editingTag) {
      console.log('editingTag', editingTag, 'tags', tags)
      const editingTagOriginal = tags.filter((tag) => tag.uuid === editingTag)[0]
      setEditingTag(editingTagOriginal)
      const { zodSchema, fieldConfig } = generateZodSchemaForFunction(editingTagOriginal.value)
      setFormSchema(zodSchema)
      setFieldConfig(fieldConfig)
    }
    console.log('editingTag', editingTag, 'editingTagOrig', editingTagOrig)
  }, [editingTag])

  return formSchema && fieldConfig ? (
    <AutoForm
      // Pass the schema to the form
      fieldConfig={fieldConfig}
      formSchema={formSchema}
      onSubmit={(values) => {
        //neTags is a mapping from function name to list of key:value params
        //set tags and keep the old tags
        //convert values to name and value
        const valuesArray = Object.entries(values)
        const valuesTfmd = valuesArray.map(([name, value]) => {
          return { name: name, value: value }
        })
        const newTags = [
          ...tags.filter((tag) => tag.uuid !== editingTag),
          {
            uuid: editingTag,
            value: editingTagOrig?.value,
            address: editingTagOrig?.address,
            contractAbi: editingTagOrig?.contractAbi,
            function: editingTagOrig?.function,
            params: valuesTfmd,
          },
        ]
        setTags(newTags)
        setOpen(false)
      }}>
      <div
        //justify right
        className="flex justify-end">
        <AutoFormSubmit>Update Function</AutoFormSubmit>
      </div>

      {/*
      All children passed to the form will be rendered below the form.
      */}
    </AutoForm>
  ) : null
}
