import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { ThreeElements } from '@react-three/fiber'

declare module '@react-three/fiber' {
    interface ThreeElements {
        meshLineGeometry: any
        meshLineMaterial: any
    }
}
