package com.vpcnative

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.vpcnative.ui.navigation.NavHost
import com.vpcnative.ui.theme.VPCNativeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VPCNativeTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    NavHost()
                }
            }
        }
    }
}
