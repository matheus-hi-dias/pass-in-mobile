import { useState } from "react"
import {View, Image, StatusBar, Alert} from "react-native"
import {FontAwesome6, MaterialIcons} from '@expo/vector-icons'
import { Link, router } from "expo-router"
import axios from "axios"

import { api } from "@/server/api"
import { useBadgeStore } from "@/store/badge-store"

import { Input } from "@/components/input"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"

const EVENT_ID = "c01c13f1-6eba-46a5-89c5-16455e6acdef"

export default function Register(){
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)	

  const badgeStore = useBadgeStore()

  async function handleRegister(){
    try {
      if(!name.trim() || !email.trim()) {
        return Alert.alert("Inscrição", "Preencha todos os campos")
      }
      setIsLoading(true)

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {name, email})

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(`/attendees/${registerResponse.data.attendeeId}/badge`)

        badgeStore.save(badgeResponse.data.badge)

        Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
          { text: "OK", onPress:() => router.push("/ticket") }
        ])
      }
      
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      if(axios.isAxiosError(error)){
        if(String(error.response?.data.message).includes("already registered")){
          return Alert.alert("Inscrição", "Este e-mail já está cadastrado.")
        }
      }
      Alert.alert("Inscrição", "Não foi possível fazer a inscrição")
    }
  }
  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar barStyle="light-content" />

      <Image source={require("@/assets/logo.png")} className="h-16" resizeMode="contain" />
      
      <View className="w-full mt-12 gap-3">
        <Input>
          <FontAwesome6 
            name="user-circle" 
            color={colors.green[200]} 
            size={20}
          />
          <Input.Field placeholder="Nome completo" onChangeText={setName}/>
        </Input>

        <Input>
          <MaterialIcons 
            name="alternate-email" 
            color={colors.green[200]} 
            size={20}
          />
          <Input.Field placeholder="E-mail" keyboardType="email-address" onChangeText={setEmail}/>
        </Input>

        <Button title="Realizar inscrição" onPress={handleRegister} isLoading={isLoading} />

        <Link href="/" className="text-gray-100 text-base font-bold text-center mt-8">
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}