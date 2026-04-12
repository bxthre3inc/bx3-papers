package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vpc.valleyplayers.data.api.VPCApiService

@Composable
fun LoginScreen(onLogin: (String) -> Unit, onRegister: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    Box(
        modifier = Modifier.fillMaxSize().background(
            androidx.compose.ui.graphics.Color(0xFF0D0015)
        ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("\uD83C\uDFB2", fontSize = 64.sp)
            Spacer(Modifier.height(16.dp))
            Text("Valley Players Club", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = 0xFFFFD700.toInt().let { MaterialTheme.colorScheme.onBackground })
            Text("Sweepstakes Gaming", fontSize = 14.sp, color = 0xFFFFD700.toInt().let { MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f) })

            Spacer(Modifier.height(48.dp))

            OutlinedTextField(
                value = email, onValueChange = { email = it },
                label = { Text("Email") }, modifier = Modifier.fillMaxWidth(),
                singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = 0xFF6B21A8.let { androidx.compose.ui.graphics.Color(it) })
            )
            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = password, onValueChange = { password = it },
                label = { Text("Password") }, modifier = Modifier.fillMaxWidth(),
                singleLine = true, visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            if (error != null) {
                Spacer(Modifier.height(8.dp))
                Text(error!!, color = 0xFFEF4444.let { androidx.compose.ui.graphics.Color(it) }, fontSize = 14.sp)
            }

            Spacer(Modifier.height(24.dp))

            Button(
                onClick = {
                    loading = true; error = null
                    VPCApiService.login(email, password) { ok, msg ->
                        loading = false
                        if (ok) onLogin(msg) else error = msg
                    }
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                enabled = !loading && email.isNotBlank() && password.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = 0xFF6B21A8.let { androidx.compose.ui.graphics.Color(it) })
            ) {
                Text(if (loading) "Signing In..." else "Sign In", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(16.dp))

            TextButton(onClick = onRegister) {
                Text("No account? Register", color = 0xFFFFD700.let { androidx.compose.ui.graphics.Color(it) })
            }
        }
    }
}
