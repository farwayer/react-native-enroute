import React from 'react'
import {View, Text, Button} from 'react-native'


export default function ShopDetail({shop, location, pop}) {
  return (
    <View>
      <Text>{location}</Text>
      <Text>{shop}</Text>
      <Button onPress={pop} title="Back to list" />
    </View>
  )
}
