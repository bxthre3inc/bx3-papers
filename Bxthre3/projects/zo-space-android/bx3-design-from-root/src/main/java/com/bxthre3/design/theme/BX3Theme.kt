package com.bxthre3.design.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color

enum class ThemeVariant {
    ZoSpace,
    AgentOS,
    VPC,
    Irrig8
}

private val ZoSpaceColors = darkColorScheme(
    primary = BX3Colors.primary,
    onPrimary = BX3Colors.onPrimary,
    primaryContainer = BX3Colors.primaryContainer,
    onPrimaryContainer = BX3Colors.onPrimaryContainer,
    secondary = BX3Colors.secondary,
    onSecondary = BX3Colors.onSecondary,
    background = BX3Colors.background,
    surface = BX3Colors.surface,
    surfaceVariant = BX3Colors.surfaceVariant,
    onSurface = BX3Colors.onSurface,
    onSurfaceVariant = BX3Colors.onSurfaceVariant,
    error = BX3Colors.error
)

private val AgentOSColors = darkColorScheme(
    primary = Color(0xFF1B5E20),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF4CAF50),
    onPrimaryContainer = Color(0xFF1B5E20),
    secondary = Color(0xFF81C784),
    onSecondary = Color(0xFF000000),
    background = BX3Colors.background,
    surface = BX3Colors.surface,
    surfaceVariant = BX3Colors.surfaceVariant,
    onSurface = BX3Colors.onSurface,
    onSurfaceVariant = BX3Colors.onSurfaceVariant,
    error = BX3Colors.error
)

private val VPCColors = darkColorScheme(
    primary = Color(0xFF004D40),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF26A69A),
    onPrimaryContainer = Color(0xFF004D40),
    secondary = Color(0xFF80CBC4),
    onSecondary = Color(0xFF000000),
    background = BX3Colors.background,
    surface = BX3Colors.surface,
    surfaceVariant = BX3Colors.surfaceVariant,
    onSurface = BX3Colors.onSurface,
    onSurfaceVariant = BX3Colors.onSurfaceVariant,
    error = BX3Colors.error
)

private val Irrig8Colors = darkColorScheme(
    primary = Color(0xFF1565C0),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF42A5F5),
    onPrimaryContainer = Color(0xFF1565C0),
    secondary = Color(0xFF90CAF9),
    onSecondary = Color(0xFF000000),
    background = BX3Colors.background,
    surface = BX3Colors.surface,
    surfaceVariant = BX3Colors.surfaceVariant,
    onSurface = BX3Colors.onSurface,
    onSurfaceVariant = BX3Colors.onSurfaceVariant,
    error = BX3Colors.error
)

private val LocalThemeVariant = compositionLocalOf { ThemeVariant.ZoSpace }

fun getThemeColors(variant: ThemeVariant): ColorScheme {
    return when (variant) {
        ThemeVariant.ZoSpace -> ZoSpaceColors
        ThemeVariant.AgentOS -> AgentOSColors
        ThemeVariant.VPC -> VPCColors
        ThemeVariant.Irrig8 -> Irrig8Colors
    }
}

@Composable
fun BX3Theme(
    initialTheme: ThemeVariant = ThemeVariant.ZoSpace,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    var currentVariant by remember { mutableStateOf(initialTheme) }
    
    val colorScheme = remember(currentVariant) {
        getThemeColors(currentVariant)
    }
    
    CompositionLocalProvider(LocalThemeVariant provides currentVariant) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography(),
            content = content
        )
    }
}
