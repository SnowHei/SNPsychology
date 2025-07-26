// Schedule functionality for SNPsychology website

class ScheduleManager {
    constructor() {
        this.exercises = this.loadExercises();
        this.exerciseDescriptions = {
            'respiracao-478': {
                name: 'Respiração 4-7-8',
                duration: '2-3 min',
                description: 'Inspire por 4s, segure por 7s, expire por 8s',
                icon: '🌬️'
            },
            'meditacao-5min': {
                name: 'Meditação 5 Minutos',
                duration: '5 min',
                description: 'Foque na respiração e acalme a mente',
                icon: '🧘'
            },
            'observacao-consciente': {
                name: 'Observação Consciente',
                duration: '2 min',
                description: 'Observe um objeto com atenção plena',
                icon: '👁️'
            },
            'pausa-digital': {
                name: 'Pausa Digital',
                duration: '2 min',
                description: '2 minutos longe das telas',
                icon: '📱'
            },
            'tecnica-stop': {
                name: 'Técnica STOP',
                duration: '1-2 min',
                description: 'Stop, Take a breath, Observe, Proceed',
                icon: '🛡️'
            },
            'termometro-emocional': {
                name: 'Termômetro Emocional',
                duration: '1 min',
                description: 'Avalie sua emoção de 1 a 10',
                icon: '🌡️'
            },
            'reset-mental': {
                name: 'Reset Mental',
                duration: '2 min',
                description: 'Respire e visualize um lugar calmo',
                icon: '⚡'
            },
            'alongamento': {
                name: 'Alongamento Energizante',
                duration: '3-5 min',
                description: 'Movimentos para reativar a energia',
                icon: '🔋'
            },
            'foco-laser': {
                name: 'Foco Laser (15min)',
                duration: '15 min',
                description: 'Concentração total em uma tarefa',
                icon: '🎯'
            },
            'caminhada-mindful': {
                name: 'Caminhada Mindful',
                duration: '5-10 min',
                description: 'Caminhe com atenção plena',
                icon: '🚶'
            },
            'diario-emocional': {
                name: 'Diário Emocional',
                duration: '3-5 min',
                description: 'Registre suas emoções e reflexões',
                icon: '📝'
            },
            'reframe-positivo': {
                name: 'Reframe Positivo',
                duration: '2-3 min',
                description: 'Transforme pensamentos negativos',
                icon: '🔄'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderSchedule();
        this.updateStatistics();
    }
    
    bindEvents() {
        const form = document.getElementById('scheduleForm');
        const clearButton = document.getElementById('clearSchedule');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearSchedule());
        }
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const exerciseType = document.getElementById('exerciseType').value;
        const exerciseTime = document.getElementById('exerciseTime').value;
        const exerciseFrequency = document.getElementById('exerciseFrequency').value;
        
        if (!exerciseType || !exerciseTime || !exerciseFrequency) {
            window.SNPsychology.utils.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        const exercise = {
            id: window.SNPsychology.utils.generateId(),
            type: exerciseType,
            time: exerciseTime,
            frequency: exerciseFrequency,
            completed: false,
            createdAt: new Date().toISOString(),
            completedDates: []
        };
        
        this.exercises.push(exercise);
        this.saveExercises();
        this.renderSchedule();
        this.updateStatistics();
        
        // Reset form
        document.getElementById('scheduleForm').reset();
        
        window.SNPsychology.utils.showNotification('Exercício adicionado com sucesso!', 'success');
    }
    
    renderSchedule() {
        const container = document.getElementById('scheduleItems');
        if (!container) return;
        
        if (this.exercises.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #64748B; padding: 40px;">
                    <p>Nenhum exercício adicionado ainda.</p>
                    <p>Use o formulário acima para criar sua rotina personalizada!</p>
                </div>
            `;
            return;
        }
        
        // Sort exercises by time
        const sortedExercises = [...this.exercises].sort((a, b) => {
            return a.time.localeCompare(b.time);
        });
        
        container.innerHTML = sortedExercises.map(exercise => {
            const exerciseInfo = this.exerciseDescriptions[exercise.type];
            const isCompletedToday = this.isCompletedToday(exercise);
            
            return `
                <div class="schedule-item ${isCompletedToday ? 'completed' : ''}" data-id="${exercise.id}">
                    <div class="schedule-text">
                        <div class="schedule-time">${window.SNPsychology.utils.formatTime(exercise.time)}</div>
                        <div class="schedule-exercise">
                            ${exerciseInfo.icon} ${exerciseInfo.name}
                            <span style="color: #64748B; font-size: 0.9rem; margin-left: 10px;">
                                (${exerciseInfo.duration}) - ${this.getFrequencyText(exercise.frequency)}
                            </span>
                        </div>
                    </div>
                    <div class="schedule-actions">
                        ${!isCompletedToday ? 
                            `<button class="btn btn-success btn-small" onclick="scheduleManager.completeExercise('${exercise.id}')">✓ Concluir</button>` :
                            `<button class="btn btn-small" onclick="scheduleManager.uncompleteExercise('${exercise.id}')" style="background: #64748B;">↶ Desfazer</button>`
                        }
                        <button class="btn btn-danger btn-small" onclick="scheduleManager.removeExercise('${exercise.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    completeExercise(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        const today = window.SNPsychology.utils.getCurrentDate();
        if (!exercise.completedDates.includes(today)) {
            exercise.completedDates.push(today);
            this.saveExercises();
            this.renderSchedule();
            this.updateStatistics();
            
            window.SNPsychology.utils.showNotification('Exercício concluído! Parabéns! 🎉', 'success');
        }
    }
    
    uncompleteExercise(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        const today = window.SNPsychology.utils.getCurrentDate();
        const index = exercise.completedDates.indexOf(today);
        if (index > -1) {
            exercise.completedDates.splice(index, 1);
            this.saveExercises();
            this.renderSchedule();
            this.updateStatistics();
            
            window.SNPsychology.utils.showNotification('Exercício desmarcado.', 'info');
        }
    }
    
    removeExercise(exerciseId) {
        if (confirm('Tem certeza que deseja remover este exercício?')) {
            this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
            this.saveExercises();
            this.renderSchedule();
            this.updateStatistics();
            
            window.SNPsychology.utils.showNotification('Exercício removido.', 'info');
        }
    }
    
    clearSchedule() {
        if (confirm('Tem certeza que deseja limpar todo o cronograma? Esta ação não pode ser desfeita.')) {
            this.exercises = [];
            this.saveExercises();
            this.renderSchedule();
            this.updateStatistics();
            
            window.SNPsychology.utils.showNotification('Cronograma limpo.', 'info');
        }
    }
    
    isCompletedToday(exercise) {
        const today = window.SNPsychology.utils.getCurrentDate();
        return exercise.completedDates.includes(today);
    }
    
    updateStatistics() {
        const totalExercisesEl = document.getElementById('totalExercises');
        const completedTodayEl = document.getElementById('completedToday');
        const streakEl = document.getElementById('streak');
        
        if (totalExercisesEl) {
            totalExercisesEl.textContent = this.exercises.length;
        }
        
        if (completedTodayEl) {
            const completedToday = this.exercises.filter(ex => this.isCompletedToday(ex)).length;
            completedTodayEl.textContent = completedToday;
        }
        
        if (streakEl) {
            const streak = this.calculateStreak();
            streakEl.textContent = `${streak} dias`;
        }
    }
    
    calculateStreak() {
        if (this.exercises.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        
        while (true) {
            const dateString = currentDate.toISOString().split('T')[0];
            const hasCompletedExercises = this.exercises.some(exercise => 
                exercise.completedDates.includes(dateString)
            );
            
            if (hasCompletedExercises) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
            
            // Prevent infinite loop
            if (streak > 365) break;
        }
        
        return streak;
    }
    
    getFrequencyText(frequency) {
        const frequencies = {
            'diario': 'Diário',
            'segunda-sexta': 'Seg-Sex',
            '3x-semana': '3x/semana',
            '2x-semana': '2x/semana',
            'semanal': 'Semanal'
        };
        return frequencies[frequency] || frequency;
    }
    
    loadExercises() {
        try {
            const stored = localStorage.getItem('snpsychology_exercises');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading exercises:', error);
            return [];
        }
    }
    
    saveExercises() {
        try {
            localStorage.setItem('snpsychology_exercises', JSON.stringify(this.exercises));
        } catch (error) {
            console.error('Error saving exercises:', error);
            window.SNPsychology.utils.showNotification('Erro ao salvar dados.', 'error');
        }
    }
}

// Initialize schedule manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('scheduleForm')) {
        window.scheduleManager = new ScheduleManager();
    }
});

// Export for global access
window.ScheduleManager = ScheduleManager;

