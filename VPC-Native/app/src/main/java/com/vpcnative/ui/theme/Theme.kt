package com.vpcnative.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFFFD700),
    onPrimary = Color(0xFF0A0A0A),
    secondary = Color(0xFF4ECDC4),
    onSecondary = Color(0xFF0A0A0A),
    tertiary = Color(0xFFFF6B6B),
    background = Color(0xFF0F0F1A),
    surface = Color(0xFF1A1A2E),
    onBackground = Color(0xFFE0E0E0),
    onSurface = Color(0xFFE0E0E0),
    error = Color(0xFFFF6B6B)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFFFFD700),
    onPrimary = Color(0xFFFFFFFF),
    secondary = Color(0xFF4ECDC4),
    onSecondary = Color(0xFFFFFFFF),
    tertiary = Color(0xFFFF6B6B),
    background = Color(0xFFFFFFFF),
    surface = Color(0xFFF5F5F5),
    onBackground = Color(0xFF1A1A2E),
    onSurface = Color(0xFF1A1A2E),
    error = Color(0xFFFF6B6B)
)

@Composable
fun VPCNativeTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(colorScheme = colorScheme, content = content)
}
