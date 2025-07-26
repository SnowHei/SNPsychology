// Contact form functionality for SNPsychology website

class ContactManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }
    
    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form data
        if (!this.validateContactForm(data)) {
            return;
        }
        
        // Simulate form submission
        this.submitContactForm(data);
    }
    
    validateContactForm(data) {
        // Check required fields
        if (!data.name.trim()) {
            window.SNPsychology.utils.showNotification('Por favor, informe seu nome.', 'error');
            return false;
        }
        
        if (!data.email.trim()) {
            window.SNPsychology.utils.showNotification('Por favor, informe seu email.', 'error');
            return false;
        }
        
        if (!window.SNPsychology.utils.validateEmail(data.email)) {
            window.SNPsychology.utils.showNotification('Por favor, informe um email válido.', 'error');
            return false;
        }
        
        if (!data.subject) {
            window.SNPsychology.utils.showNotification('Por favor, selecione um assunto.', 'error');
            return false;
        }
        
        if (!data.message.trim()) {
            window.SNPsychology.utils.showNotification('Por favor, escreva sua mensagem.', 'error');
            return false;
        }
        
        if (data.message.trim().length < 10) {
            window.SNPsychology.utils.showNotification('A mensagem deve ter pelo menos 10 caracteres.', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitContactForm(data) {
        // Show loading state
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real application, you would send this data to your backend
            console.log('Contact form data:', data);
            
            // Save to localStorage for demo purposes
            this.saveContactMessage(data);
            
            // Show success message
            window.SNPsychology.utils.showNotification(
                'Mensagem enviada com sucesso! Entraremos em contato em breve.',
                'success'
            );
            
            // Reset form
            document.getElementById('contactForm').reset();
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            window.SNPsychology.utils.showNotification(
                'Erro ao enviar mensagem. Tente novamente mais tarde.',
                'error'
            );
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    saveContactMessage(data) {
        try {
            const messages = this.getStoredMessages();
            const message = {
                ...data,
                id: window.SNPsychology.utils.generateId(),
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            messages.push(message);
            localStorage.setItem('snpsychology_contact_messages', JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving contact message:', error);
        }
    }
    
    getStoredMessages() {
        try {
            const stored = localStorage.getItem('snpsychology_contact_messages');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading stored messages:', error);
            return [];
        }
    }
    
    // Method to retrieve messages (for admin purposes)
    getMessages() {
        return this.getStoredMessages();
    }
    
    // Method to mark message as read (for admin purposes)
    markAsRead(messageId) {
        try {
            const messages = this.getStoredMessages();
            const message = messages.find(msg => msg.id === messageId);
            if (message) {
                message.status = 'read';
                localStorage.setItem('snpsychology_contact_messages', JSON.stringify(messages));
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('message');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
});

// Initialize contact manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        window.contactManager = new ContactManager();
    }
});

// Export for global access
window.ContactManager = ContactManager;

