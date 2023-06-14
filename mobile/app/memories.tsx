import * as reactNative from 'react-native'

export function Memories() {
  return (
    <reactNative.View className="flex-1 items-center justify-center">
      <reactNative.Text>Memories</reactNative.Text>
    </reactNative.View>
  )
}
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from '@expo/vector-icons/Feather'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/assets/lib/api'
import { useRouter, Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()

  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <reactNative.View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <reactNative.View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center  justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center  justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </reactNative.View>
      </reactNative.View>

      <reactNative.View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <reactNative.View key={memory.id} className="space-y-4">
              <reactNative.View className="flex-row items-center gap-2">
                <reactNative.View className="h-px w-5 bg-gray-50" />
                <reactNative.Text className="font-body text-sm text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </reactNative.Text>
              </reactNative.View>
              <reactNative.View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                />
                <reactNative.Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </reactNative.Text>
                <Link href="/memories/id" asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <reactNative.Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </reactNative.Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </reactNative.View>
            </reactNative.View>
          )
        })}
      </reactNative.View>
    </ScrollView>
  )
}
