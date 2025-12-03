// app/(app)/scan-barcode.tsx
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanBarcodeScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [lastCode, setLastCode] = useState<string | null>(null);

    function handleClose() {
        router.back();
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        setLastCode(data);
        // Aqui, no futuro, vamos usar esse código para buscar/registrar livro via API/Firebase
    };

    // Solicitar permissão se ainda não foi concedida
    if (!permission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <Text style={{ color: '#FFFFFF' }}>Carregando...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Precisamos de acesso à câmera
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#E5E7EB',
                            textAlign: 'center',
                            marginBottom: 24,
                        }}
                    >
                        Para escanear códigos de barras, precisamos acessar sua câmera.
                    </Text>
                    <TouchableOpacity
                        onPress={requestPermission}
                        style={{
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 999,
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                            Conceder permissão
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: Platform.OS === 'android' ? 8 : 0,
                    paddingBottom: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <TouchableOpacity
                    onPress={handleClose}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ marginLeft: 8 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#FFFFFF',
                        }}
                    >
                        Escanear código de barras
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#E5E7EB',
                        }}
                    >
                        Aponte a câmera para o código do livro.
                    </Text>
                </View>
            </View>

            {/* Câmera */}
            <View style={{ flex: 1 }}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: [
                            'ean13',
                            'ean8',
                            'upc_a',
                            'upc_e',
                            'code128',
                            'code39',
                        ],
                    }}
                />

                {/* Overlay com último código lido */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                >
                    {lastCode ? (
                        <>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#E5E7EB',
                                    marginBottom: 4,
                                }}
                            >
                                Último código lido:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: '#FFFFFF',
                                    marginBottom: 12,
                                }}
                                numberOfLines={2}
                            >
                                {lastCode}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setScanned(false);
                                        setLastCode(null);
                                    }}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                        borderRadius: 999,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#111827',
                                        }}
                                    >
                                        Escanear novamente
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#E5E7EB',
                            }}
                        >
                            Aponte para o código de barras do livro para capturar.
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}