#!/usr/bin/env python3
"""
JARVIS - Simple App Skeleton
A basic desktop application for Raspberry Pi
"""

import tkinter as tk
from tkinter import ttk
import os
import sys
import json
from datetime import datetime
import threading
import time

class JARVISApp:
    def __init__(self):
        """Initialize JARVIS application"""
        self.root = tk.Tk()
        self.setup_window()
        self.create_interface()
        self.running = True
        
        # Start status update thread
        self.status_thread = threading.Thread(target=self.update_status, daemon=True)
        self.status_thread.start()
        
        print("JARVIS initialized successfully")
    
    def setup_window(self):
        """Setup the main window"""
        self.root.title("JARVIS - AI Assistant")
        self.root.geometry("800x600")
        
        # Center the window
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (800 // 2)
        y = (self.root.winfo_screenheight() // 2) - (600 // 2)
        self.root.geometry(f"800x600+{x}+{y}")
        
        # Configure window properties
        self.root.configure(bg='#1a1a1a')
        self.root.option_add('*Font', 'Arial 12')
        
        # Make window resizable
        self.root.resizable(True, True)
        
        # Bind close event
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def create_interface(self):
        """Create the main interface"""
        # Main frame
        main_frame = tk.Frame(self.root, bg='#1a1a1a')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Header
        self.create_header(main_frame)
        
        # Content area
        self.create_content(main_frame)
        
        # Status bar
        self.create_status_bar(main_frame)
    
    def create_header(self, parent):
        """Create the header section"""
        header_frame = tk.Frame(parent, bg='#2a2a2a', height=80)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        header_frame.pack_propagate(False)
        
        # JARVIS title
        title_label = tk.Label(
            header_frame,
            text="JARVIS",
            font=('Arial', 24, 'bold'),
            fg='#00ff00',
            bg='#2a2a2a'
        )
        title_label.pack(side=tk.LEFT, padx=20, pady=20)
        
        # Status indicator
        self.status_label = tk.Label(
            header_frame,
            text="Online",
            font=('Arial', 12),
            fg='#00ff00',
            bg='#2a2a2a'
        )
        self.status_label.pack(side=tk.RIGHT, padx=20, pady=20)
        
        # Time display
        self.time_label = tk.Label(
            header_frame,
            text="",
            font=('Arial', 14),
            fg='white',
            bg='#2a2a2a'
        )
        self.time_label.pack(side=tk.RIGHT, padx=20, pady=20)
    
    def create_content(self, parent):
        """Create the main content area"""
        content_frame = tk.Frame(parent, bg='#1a1a1a')
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - Quick actions
        left_panel = tk.Frame(content_frame, bg='#2a2a2a', width=250)
        left_panel.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_panel.pack_propagate(False)
        
        self.create_quick_actions(left_panel)
        
        # Right panel - Information display
        right_panel = tk.Frame(content_frame, bg='#2a2a2a')
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        self.create_info_display(right_panel)
    
    def create_quick_actions(self, parent):
        """Create quick action buttons"""
        # Title
        title = tk.Label(
            parent,
            text="Quick Actions",
            font=('Arial', 16, 'bold'),
            fg='white',
            bg='#2a2a2a'
        )
        title.pack(pady=10)
        
        # Action buttons
        actions = [
            ("System Status", self.show_system_status),
            ("Weather", self.show_weather),
            ("Time", self.show_time),
            ("Camera", self.take_photo),
            ("Settings", self.show_settings),
            ("About", self.show_about)
        ]
        
        for text, command in actions:
            btn = tk.Button(
                parent,
                text=text,
                font=('Arial', 12),
                bg='#333333',
                fg='white',
                activebackground='#00ff00',
                activeforeground='black',
                relief=tk.FLAT,
                command=command,
                width=20,
                height=2
            )
            btn.pack(pady=5, padx=10)
    
    def create_info_display(self, parent):
        """Create information display area"""
        # Title
        title = tk.Label(
            parent,
            text="Information",
            font=('Arial', 16, 'bold'),
            fg='white',
            bg='#2a2a2a'
        )
        title.pack(pady=10)
        
        # Information text area
        self.info_text = tk.Text(
            parent,
            bg='#1a1a1a',
            fg='white',
            font=('Arial', 12),
            wrap=tk.WORD,
            state=tk.DISABLED
        )
        self.info_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Scrollbar
        scrollbar = tk.Scrollbar(parent, orient=tk.VERTICAL, command=self.info_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.info_text.config(yscrollcommand=scrollbar.set)
        
        # Initial welcome message
        self.update_info("Welcome to JARVIS!\n\nThis is your personal AI assistant. Use the quick action buttons to interact with different features.")
    
    def create_status_bar(self, parent):
        """Create status bar"""
        status_frame = tk.Frame(parent, bg='#2a2a2a', height=30)
        status_frame.pack(fill=tk.X, pady=(10, 0))
        status_frame.pack_propagate(False)
        
        # Status text
        self.status_text = tk.Label(
            status_frame,
            text="Ready",
            font=('Arial', 10),
            fg='#00ff00',
            bg='#2a2a2a'
        )
        self.status_text.pack(side=tk.LEFT, padx=10, pady=5)
    
    def update_status(self):
        """Update status and time in background thread"""
        while self.running:
            try:
                current_time = datetime.now().strftime("%H:%M:%S")
                self.time_label.config(text=current_time)
                time.sleep(1)
            except:
                break
    
    def update_info(self, text):
        """Update information display"""
        self.info_text.config(state=tk.NORMAL)
        self.info_text.delete(1.0, tk.END)
        self.info_text.insert(tk.END, text)
        self.info_text.config(state=tk.DISABLED)
    
    def update_status_text(self, text):
        """Update status bar text"""
        self.status_text.config(text=text)
    
    # Action handlers
    def show_system_status(self):
        """Show system status"""
        import psutil
        
        cpu_percent = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        status_info = f"""System Status:
CPU Usage: {cpu_percent}%
Memory Usage: {memory.percent}%
Disk Usage: {disk.percent}%
Free Memory: {memory.available // (1024**3)} GB
Total Memory: {memory.total // (1024**3)} GB"""
        
        self.update_info(status_info)
        self.update_status_text("System status updated")
    
    def show_weather(self):
        """Show weather information"""
        self.update_info("Weather feature coming soon!\n\nThis will integrate with weather APIs to provide current conditions and forecasts.")
        self.update_status_text("Weather feature not yet implemented")
    
    def show_time(self):
        """Show current time"""
        current_time = datetime.now().strftime("%I:%M:%S %p")
        date = datetime.now().strftime("%A, %B %d, %Y")
        
        time_info = f"""Current Time: {current_time}
Date: {date}
Timezone: Local"""
        
        self.update_info(time_info)
        self.update_status_text("Time information displayed")
    
    def take_photo(self):
        """Take a photo"""
        self.update_info("Camera feature coming soon!\n\nThis will integrate with your Pi Camera module to capture photos and videos.")
        self.update_status_text("Camera feature not yet implemented")
    
    def show_settings(self):
        """Show settings"""
        settings_info = """Settings:
- Voice Recognition: Disabled
- Camera: Disabled  
- Weather API: Not configured
- Auto-startup: Enabled
- Theme: Dark

Settings configuration coming soon!"""
        
        self.update_info(settings_info)
        self.update_status_text("Settings displayed")
    
    def show_about(self):
        """Show about information"""
        about_info = """JARVIS - Personal AI Assistant
Version: 1.0.0 (Skeleton)

Hardware:
- Raspberry Pi 5
- Elecrow 7-inch display
- Pi Camera module 3
- Arduino ESP32

Features:
- Desktop application
- System monitoring
- Extensible architecture
- Touchscreen support

This is a basic skeleton application.
More features will be added gradually!"""
        
        self.update_info(about_info)
        self.update_status_text("About information displayed")
    
    def on_closing(self):
        """Handle application closing"""
        self.running = False
        print("JARVIS shutting down...")
        self.root.destroy()
    
    def run(self):
        """Run the application"""
        print("Starting JARVIS...")
        self.root.mainloop()

def main():
    """Main entry point"""
    try:
        app = JARVISApp()
        app.run()
    except Exception as e:
        print(f"Error starting JARVIS: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 