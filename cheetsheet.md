# Cheatsheet: React Native con Expo

## Conceptos

| Concepto | Para qué sirve |
| --- | --- |
| React Native | Escribir apps para iOS y Android con JavaScript/TypeScript y UI nativa |
| Expo | Herramientas sobre React Native; evita configurar Xcode y Android Studio |
| Expo Go | App del celular que ejecuta tu proyecto escaneando un QR |
| Expo Router | Navegación basada en archivos: cada archivo en `app/` es una pantalla |
| Metro | Empaqueta tu código y lo envía al celular mientras desarrollas |

> No hay HTML ni CSS: en lugar de `div` o `p` se usan componentes como `View` y `Text`, y los estilos son objetos JS.

## Crear y correr el proyecto

```bash
npx create-expo-app@latest pokedex
cd pokedex
npm run reset-project
npx expo start
```

| Comando | Qué hace |
| --- | --- |
| `npm run reset-project` | Deja la carpeta `app/` limpia |
| `npx expo start` | Levanta el servidor y muestra el QR |
| `npx expo start --tunnel` | Úsalo si el celular no se conecta por la red local |

**Atajos en la terminal:** `r` recarga la app, `j` abre el debugger, `shift + m` abre el menú de desarrollo.

**Fast Refresh:** al guardar un archivo, el cambio aparece en el celular al instante.

## Estructura del proyecto

| Archivo | Para qué sirve |
| --- | --- |
| `app/_layout.tsx` | Layout raíz y navegación |
| `app/index.tsx` | Pantalla inicial (ruta `/`) |
| `components/` | Tus componentes reutilizables |
| `assets/` | Imágenes, íconos y fuentes |
| `app.json` | Nombre, ícono y configuración de la app |

## Componentes básicos

| Componente | En web sería | Uso |
| --- | --- | --- |
| `View` | `div` | Contenedor y layout |
| `Text` | `p`, `span` | Todo texto va dentro de un `Text` |
| `Image` | `img` | Imágenes; las remotas necesitan `width` y `height` |
| `Pressable` | `button` | Elemento tocable con `onPress` |
| `ScrollView` | `div` con scroll | Contenido corto que se desplaza |

```tsx
import { View, Text, Image, Pressable } from 'react-native';

<View>
  <Text>Hola</Text>
  <Image source={{ uri: 'https://...' }} style={{ width: 120, height: 120 }} />
  <Pressable onPress={() => console.log('tap')}>
    <Text>Tocar</Text>
  </Pressable>
</View>
```

## Estilos y flexbox

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});

<View style={styles.container}>
  <Text style={styles.title}>Pokedex</Text>
</View>
```

- Propiedades en camelCase: `backgroundColor`, no `background-color`.
- Números sin unidades (nada de `px`).
- `flexDirection` es `column` por defecto.
- `justifyContent`: eje principal. `alignItems`: eje cruzado.
- `flex: 1`: ocupa todo el espacio disponible.
- Combinar estilos: `style={[styles.card, { width: 100 }]}`.

## Props

Datos que un componente padre le pasa a un hijo. Son de solo lectura.

```tsx
type Props = { name: string; id: number };

function PokemonCard({ name, id }: Props) {
  return <Text>#{id} {name}</Text>;
}

<PokemonCard name="pikachu" id={25} />
```

## useState

Guarda datos que cambian. Cada cambio vuelve a renderizar el componente.

```tsx
import { useState } from 'react';

const [count, setCount] = useState(0);

<Pressable onPress={() => setCount(count + 1)}>
  <Text>Toques: {count}</Text>
</Pressable>
```

Nunca modifiques el estado directo (`count++`); usa siempre el setter.

## useEffect

Ejecuta código después del render, por ejemplo una petición a una API.

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // se ejecuta al montar la pantalla
}, []);
```

| Dependencias | Cuándo se ejecuta |
| --- | --- |
| `[]` | Una sola vez al abrir la pantalla |
| `[valor]` | Al abrir y cada vez que `valor` cambia |
| Sin arreglo | En cada render (casi nunca lo quieres) |

El callback no puede ser `async`; define una función async adentro y llámala.

## Consumir la PokeAPI

```
GET https://pokeapi.co/api/v2/pokemon?limit=151
```

```json
{
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" }
  ]
}
```

El id se saca de la `url` y con él se arma la imagen:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

```tsx
useEffect(() => {
  const load = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await res.json();
    const list = data.results.map((p: { name: string; url: string }) => ({
      name: p.name,
      id: Number(p.url.split('/').filter(Boolean).pop()),
    }));
    setPokemons(list);
    setLoading(false);
  };
  load();
}, []);
```

## FlatList

Lista optimizada: solo renderiza lo que se ve en pantalla. Úsala siempre para listas largas.

```tsx
import { FlatList } from 'react-native';

<FlatList
  data={pokemons}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} />}
  numColumns={2}
/>
```

| Prop | Para qué sirve |
| --- | --- |
| `data` | Arreglo de elementos |
| `renderItem` | Recibe `{ item, index }` y devuelve el componente |
| `keyExtractor` | Clave única por elemento (string) |
| `numColumns` | Grilla de N columnas |
| `ListEmptyComponent` | Qué mostrar si la lista está vacía |

## Componente PokemonCard

`components/PokemonCard.tsx`

```tsx
import { Image, StyleSheet, Text, View } from 'react-native';

const IMG = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export default function PokemonCard({ id, name }: { id: number; name: string }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: IMG(id) }} style={styles.image} />
      <Text style={styles.number}>#{id.toString().padStart(3, '0')}</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 6, padding: 12, borderRadius: 12, backgroundColor: '#f2f2f2', alignItems: 'center' },
  image: { width: 96, height: 96 },
  number: { color: '#888', fontSize: 12 },
  name: { fontSize: 16, fontWeight: '600', textTransform: 'capitalize' },
});
```

## ActivityIndicator

Spinner nativo para mostrar que algo está cargando.

```tsx
import { ActivityIndicator } from 'react-native';

const [loading, setLoading] = useState(true);

if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
```

Patrón: `loading` empieza en `true`, se muestra el spinner y, al terminar el `fetch`, se pasa a `false`.
